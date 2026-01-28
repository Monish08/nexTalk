import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { voteSchema } from '@/lib/validations'
import { calculateScore } from '@/lib/utils'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const validatedData = voteSchema.parse(body)

    const { value, postId, commentId } = validatedData

    // Check if user already voted
    const existingVote = await prisma.vote.findFirst({
      where: {
        userId: session.user.id,
        ...(postId ? { postId } : { commentId }),
      },
    })

    if (existingVote) {
      if (existingVote.value === value) {
        // Remove vote if clicking the same button
        await prisma.vote.delete({
          where: { id: existingVote.id },
        })

        // Update post/comment vote counts
        if (postId) {
          await prisma.post.update({
            where: { id: postId },
            data: {
              upvotes: value === 1 ? { decrement: 1 } : undefined,
              downvotes: value === -1 ? { decrement: 1 } : undefined,
            },
          })
        } else if (commentId) {
          await prisma.comment.update({
            where: { id: commentId },
            data: {
              upvotes: value === 1 ? { decrement: 1 } : undefined,
              downvotes: value === -1 ? { decrement: 1 } : undefined,
            },
          })
        }

        return NextResponse.json({ message: 'Vote removed' })
      } else {
        // Update existing vote
        await prisma.vote.update({
          where: { id: existingVote.id },
          data: { value },
        })

        // Update post/comment vote counts
        if (postId) {
          const updateData: any = {}
          
          if (existingVote.value === 1) {
            updateData.upvotes = { decrement: 1 }
            updateData.downvotes = { increment: 1 }
          } else {
            updateData.downvotes = { decrement: 1 }
            updateData.upvotes = { increment: 1 }
          }

          await prisma.post.update({
            where: { id: postId },
            data: updateData,
          })
        } else if (commentId) {
          const updateData: any = {}
          
          if (existingVote.value === 1) {
            updateData.upvotes = { decrement: 1 }
            updateData.downvotes = { increment: 1 }
          } else {
            updateData.downvotes = { decrement: 1 }
            updateData.upvotes = { increment: 1 }
          }

          await prisma.comment.update({
            where: { id: commentId },
            data: updateData,
          })
        }

        return NextResponse.json({ message: 'Vote updated' })
      }
    }

    // Create new vote
    await prisma.vote.create({
      data: {
        value,
        userId: session.user.id,
        postId: postId || null,
        commentId: commentId || null,
      },
    })

    // Update post/comment vote counts and score
    if (postId) {
      const post = await prisma.post.update({
        where: { id: postId },
        data: {
          upvotes: value === 1 ? { increment: 1 } : undefined,
          downvotes: value === -1 ? { increment: 1 } : undefined,
        },
      })

      // Recalculate and update score
      const newScore = calculateScore(post.upvotes, post.downvotes, post.createdAt)
      await prisma.post.update({
        where: { id: postId },
        data: { score: newScore },
      })

      // Create notification for upvotes
      if (value === 1 && post.authorId !== session.user.id) {
        await prisma.notification.create({
          data: {
            type: 'UPVOTE',
            message: `${session.user.name} upvoted your post`,
            userId: post.authorId,
            postId: post.id,
          },
        })
      }
    } else if (commentId) {
      await prisma.comment.update({
        where: { id: commentId },
        data: {
          upvotes: value === 1 ? { increment: 1 } : undefined,
          downvotes: value === -1 ? { increment: 1 } : undefined,
        },
      })
    }

    return NextResponse.json({ message: 'Vote created' }, { status: 201 })
  } catch (error) {
    console.error('Error processing vote:', error)
    return NextResponse.json(
      { error: 'Failed to process vote' },
      { status: 500 }
    )
  }
}
